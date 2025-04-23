import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function WaveformPlayer({ audioUrl, isPlaying, onPlayPause }: Props) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    setTimeout(() => {
      if (!waveformRef.current) return;

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#777",
        progressColor: "#b083ff",
        cursorColor: "#fff",
        height: 60,
        backend: "MediaElement", // CORS-safe
        mediaControls: false,
        // @ts-ignore
        responsive: true,
      });

      try {
        wavesurfer.current.load(audioUrl);
        wavesurfer.current.on("finish", () => {
          onPlayPause();
        });
      } catch (err) {
        console.error("Failed to load audio URL", err);
      }
    }, 100);

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurfer.current) {
      isPlaying ? wavesurfer.current.play() : wavesurfer.current.pause();
    }
  }, [isPlaying]);

  return <div ref={waveformRef} />;
}