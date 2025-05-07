import time
import requests
import json
import argparse
import os
import createBitwigProject
import soundfile as sf

# Base API endpoint for Tonn
BASE_URL = "https://tonn.roexaudio.com"

# Constants that define how many times to retry network requests and how long to wait between retries
MAX_RETRIES = 3
RETRY_DELAY = 2  # in seconds
API_KEY = "go to https://tonn-portal.roexaudio.com to get one"


def download_audio(file_name, url, output_dir="audio_in"):
    """
    Downloads an audio file from the given URL and saves it locally.

    :param file_name: Name to save the file as.
    :param url: URL to download from.
    :param output_dir: Directory to save the file.
    :return: Local file path if successful, None otherwise.
    """
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    local_filename = os.path.join(output_dir, file_name)

    # Attempt to download up to MAX_RETRIES times
    for attempt in range(MAX_RETRIES):
        try:
            print(f"Downloading {file_name} from {url} (Attempt {attempt + 1})...")
            response = requests.get(url, stream=True, timeout=10)
            response.raise_for_status()  # Raise an exception if the request fails

            # Write the response content in chunks to avoid large memory usage
            with open(local_filename, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)

            # Confirm the file was actually created
            if os.path.exists(local_filename):
                print(f"Successfully downloaded {file_name}")
                return local_filename
            else:
                # If the file doesn't exist after the download, raise an error to trigger a retry
                raise FileNotFoundError("File does not exist after download.")

        except requests.exceptions.RequestException as e:
            print(f"Error downloading {file_name}: {e}")
            # If this wasn't the last attempt, wait before retrying
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY ** (attempt + 1))
            else:
                print(f"Failed to download {file_name} after {MAX_RETRIES} attempts.")
                return None


def download_audio_files(stems, output_dir="audio_in"):
    """
    Downloads all audio stems from URLs and saves them locally.

    :param stems: Dictionary where keys are track names and values are download URLs.
    :param output_dir: Directory to store downloaded audio files.
    :return: Dictionary mapping track names to local file paths.
    """
    downloaded_files = {}

    # For each track in the stems dictionary, attempt to download
    for track_name, url in stems.items():
        local_path = download_audio(track_name, url, output_dir)
        if local_path:
            downloaded_files[track_name] = local_path

    return downloaded_files


def download_original_audio(track_data, output_dir="audio_in"):
    """
    Downloads original multitrack audio files from the provided trackData.

    :param track_data: List of track objects containing 'trackURL' and file names.
    :param output_dir: Directory to store the downloaded files.
    :return: Dictionary mapping track names to local file paths.
    """
    downloaded_files = {}

    # Each track entry has a 'trackURL'; we derive the local filename from the URL
    for track in track_data:
        file_url = track["trackURL"]
        track_name = os.path.basename(file_url)
        local_path = download_audio(track_name, file_url, output_dir)

        if local_path:
            downloaded_files[track_name] = local_path

    return downloaded_files


def format_audio_tracks_for_daw(mix_output_settings, downloaded_files):
    """
    Convert mix output settings and downloaded audio file paths into the format required
    by create_project_with_audio_tracks.

    :param mix_output_settings: Dictionary containing mix settings for each track.
    :param downloaded_files: Dictionary mapping track names to local file paths.
    :return: List of dictionaries formatted for create_project_with_audio_tracks.
    """
    audio_tracks = []

    # Loop through each track in the mix output settings
    for track_name, settings in mix_output_settings.items():
        file_path = downloaded_files.get(track_name)
        if not file_path:
            print(f"Warning: No file found for {track_name}, skipping.")
            continue

        try:
            # Load the audio file into a NumPy array for processing
            audio_x, sr = sf.read(file_path, dtype="float32")
        except FileNotFoundError as e:
            raise e
        except Exception as e:
            print("Problem loading audio with exception: " + str(e))
            raise e

        # Apply an initial gain multiplier directly to the audio data
        audio_x = audio_x * settings["gain_settings"]["initial_gain"]
        # Save the modified audio back to the file
        sf.write(file_path, audio_x, sr)

        # Build EQ settings from the provided band data (if any)
        eq_bands = []
        if "eq_settings" in settings:
            for band_key, band_values in settings["eq_settings"].items():
                eq_bands.append({
                    "frequency": band_values["centre_freq"],
                    "gain": band_values["gain"],
                    "q": band_values["q"],
                    "enabled": True,
                    "band_type": "bell"  # Default to bell curve
                })

        # Format the compressor settings; note that ratio is converted into a percentage
        compressor_settings = {
            "threshold": settings["drc_settings"]["threshold"],
            "ratio": continuous_to_percentage(settings["drc_settings"]["ratio"]),
            "attack": settings["drc_settings"]["attack_ms"],  # Provided in ms
            "release": settings["drc_settings"]["release_ms"],
            "input_gain": 0.0,
            "output_gain": 0.0,
            "auto_makeup": True
        }

        # Append a dict describing this track to the list
        audio_tracks.append({
            "file_path": file_path,
            # get_file_duration_in_secs expects channel-first data, so we transpose audio_x.
            "sample_duration": get_file_duration_in_secs(audio_x.T, sr),
            "gain": settings["gain_settings"]["gain_amplitude"],
            # Normalizing panning angle from a -60..+60 range to a -1..+1 range used by the DAW
            "pan": normalise_daw_values(settings["panning_settings"]["panning_angle"], -60, 60, -1, 1),
            "eq_settings": eq_bands,
            "compressor_settings": compressor_settings
        })

    return audio_tracks


def normalise_daw_values(value, old_min=-60.0, old_max=60.0, new_min=-1.0, new_max=1.0):
    """
    Rescales a value from the old range (old_min..old_max) to the new range (new_min..new_max).

    :param value: The value in the old range.
    :param old_min: The minimum of the old range.
    :param old_max: The maximum of the old range.
    :param new_min: The minimum of the new range.
    :param new_max: The maximum of the new range.
    :return: The value rescaled into the new range.
    """
    ratio = (value - old_min) / (old_max - old_min)
    normalized_value = ratio * (new_min - new_max) + new_max
    return normalized_value


def get_file_duration_in_secs(audio_x, sample_rate):
    """
    Calculate the duration of the given audio in seconds.

    :param audio_x: NumPy array of the audio data (channels x samples).
    :param sample_rate: Sampling rate of the audio file.
    :return: Floating-point duration in seconds.
    """
    return float(audio_x.shape[1] / sample_rate)


def continuous_to_percentage(x: float) -> float:
    """
    Convert a continuous value (>=1) to a percentage based on the
    mapping 1->0%, 2->50%, 3->66.6%, ..., 10->90%, 100->100%.

    :param x: A float value indicating the compression ratio (>=1).
    :return: A float value indicating the percentage ratio.
    """
    # Handle ratios below 1 if desired
    if x < 1:
        return 0.0

    # Main formula: percentage = 100 * (1 - 1/x)
    percentage = 100 * (1 - 1 / x)

    # Clamp to 100 at x=100 or above
    if x >= 100:
        percentage = 100.0

    return percentage


def poll_preview_mix(task_id, headers, max_attempts=30, poll_interval=5):
    """
    Poll the /retrievepreviewmix endpoint until the preview mix is ready.

    This function repeatedly sends a POST request with the task ID to the
    /retrievepreviewmix endpoint, waiting poll_interval seconds between attempts.

    :param task_id: The multitrack task ID returned from the preview mix creation.
    :param headers: HTTP headers including Content-Type and API key.
    :param max_attempts: Maximum number of polling attempts.
    :param poll_interval: Seconds to wait between attempts.
    :return: The preview mix task results if ready, otherwise None.
    """
    retrieve_url = f"{BASE_URL}/retrievepreviewmix"
    retrieve_payload = {
        "multitrackData": {
            "multitrackTaskId": task_id,
            "retrieveFXSettings": True  # Set to False unless FX settings are needed
        }
    }

    print("Polling for the preview mix URL...")
    attempt = 0
    while attempt < max_attempts:
        try:
            # Send a POST request to the /retrievepreviewmix endpoint
            retrieve_response = requests.post(retrieve_url, json=retrieve_payload, headers=headers)
        except Exception as e:
            print("Error during POST request to /retrievepreviewmix:", e)
            return None

        try:
            # Parse the JSON response
            retrieve_data = retrieve_response.json()
        except Exception as e:
            print("Error parsing JSON response:", e)
            return None

        # Check the response status to see if the mix is done
        if retrieve_response.status_code == 202:
            current_status = retrieve_data.get("status", "Processing")
            print(f"Attempt {attempt + 1}/{max_attempts}: Task still processing. Status: {current_status}.")
        elif retrieve_response.status_code == 200:
            # If the API returns 200, the mix might be completed
            results = retrieve_data.get("previewMixTaskResults", {})
            status = results.get("status", "")
            if status == "MIX_TASK_PREVIEW_COMPLETED":
                print("Preview mix is complete.")
                return results
            else:
                print("Received 200 but unexpected status in response:", status)
                return None
        else:
            # Handle any unexpected HTTP status codes
            print("Unexpected response code:", retrieve_response.status_code)
            print("Response:", retrieve_response.text)
            return None

        # Wait before the next attempt
        time.sleep(poll_interval)
        attempt += 1

    print("Preview mix URL was not available after polling. Please try again later.")
    return None


def main():
    """
    Main function to handle preview mix retrieval, download audio stems,
    and format them for a Bitwig DAW project.
    """
    # Set up command-line argument parsing
    parser = argparse.ArgumentParser(
        description="Retrieve preview mix, download stems, and prepare DAW project."
    )
    parser.add_argument("payload_file", type=str, help="Path to the JSON file containing the mix preview payload")
    args = parser.parse_args()

    # Load the preview payload from the specified JSON file
    try:
        with open(args.payload_file, "r") as f:
            preview_payload = json.load(f)
    except Exception as e:
        print("Error reading preview payload JSON file:", e)
        return

    # Prepare headers for the API calls
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }

    # Extract original track URLs before sending the request (to have them on hand for local use)
    track_data = preview_payload["multitrackData"]["trackData"]
    original_audio_files = download_original_audio(track_data)

    # Step 1: Send a POST request to initiate the preview mix process
    mixpreview_url = f"{BASE_URL}/mixpreview"
    print(f"Sending POST request to {mixpreview_url} for preview mix...")
    try:
        response = requests.post(mixpreview_url, json=preview_payload, headers=headers)
    except Exception as e:
        print("Error during POST request to /mixpreview:", e)
        return

    # Verify the request to start the preview mix was successful
    if response.status_code == 200:
        try:
            data = response.json()
        except Exception as e:
            print("Error parsing preview mix JSON response:", e)
            return

        # Get the task ID required for polling
        task_id = data.get("multitrack_task_id")
        if not task_id:
            print("Error: Task ID not found in response:", data)
            return
        print("Mix preview task created successfully. Task ID:", task_id)
    else:
        print("Failed to create preview mix.")
        return

    # Step 2: Poll for the mix to complete
    preview_results = poll_preview_mix(task_id, headers)
    if not preview_results:
        return

    # The endpoint returns settings for each track, like gain, EQ, etc.
    mix_output_settings = preview_results.get("mix_output_settings", {})

    # Step 3: Format the tracks using the original audio files and the new mix settings
    audio_tracks = format_audio_tracks_for_daw(mix_output_settings, original_audio_files)

    # Step 4: Create a Bitwig project with the formatted track data
    createBitwigProject.create_project_with_audio_tracks(audio_tracks)


if __name__ == "__main__":
    main()
