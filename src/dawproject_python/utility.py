from typing import Set

# Assuming the following classes and enums are already defined in your project
from classes.track import Track
from classes.channel import Channel
from classes.realParameter import RealParameter
from classes.audio import Audio
from classes.fileReference import FileReference
from classes.warp import Warp
from classes.clip import Clip
from classes.clips import Clips
from classes.timeUnit import TimeUnit
from classes.contentType import ContentType
from classes.mixerRole import MixerRole
from classes.unit import Unit
from classes.timeline import Timeline


class Utility:
    @staticmethod
    def create_track(
        name: str,
        content_types: Set[ContentType],
        mixer_role: MixerRole,
        volume: float,
        pan: float,
    ) -> Track:
        track_channel = Channel(
            volume=RealParameter(value=volume, unit=Unit(value="linear")),
            pan=RealParameter(value=pan, unit=Unit(value="normalized")),
            role=mixer_role,
        )
        track = Track(name=name, channel=track_channel, content_type=content_types, loaded=True)
        return track

    @staticmethod
    def create_audio(
        relative_path: str, sample_rate: int, channels: int, duration: float
    ) -> Audio:
        audio = Audio(
            time_unit=TimeUnit(value="seconds"),
            file=FileReference(path=relative_path, external=False),
            sample_rate=sample_rate,
            channels=channels,
            duration=duration,
        )
        return audio

    @staticmethod
    def create_warp(time: float, content_time: float) -> Warp:
        warp = Warp(time=time, content_time=content_time)
        return warp

    @staticmethod
    def create_clip(content: Timeline, time: float, duration: float) -> Clip:
        clip = Clip(content=content, time=time, duration=duration)
        return clip

    @staticmethod
    def create_clips(*clips: Clip) -> Clips:
        clips_timeline = Clips(clips=list(clips))
        return clips_timeline
