import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm";

interface MiniWaveformProps {
  url: string;
  height?: number;
}

const WaveformMiniPlayer: React.FC<MiniWaveformProps> = ({ url, height = 30 }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#a855f7",
        progressColor: "#9333ea",
        height,
        barWidth: 2,
        interact: false,
        plugins: [
          TimelinePlugin.create()
        ],
      });

      waveSurfer.current.load(url);

      return () => {
        waveSurfer.current?.destroy();
      };
    }
  }, [url, height]);

  return <div className="rounded overflow-hidden" ref={waveformRef} />;
};

export default WaveformMiniPlayer;
