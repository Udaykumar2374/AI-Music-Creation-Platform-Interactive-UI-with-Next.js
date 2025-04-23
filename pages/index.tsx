import { useState, useEffect, useRef } from "react";
import { FiHome, FiSearch, FiBell, FiPlus, FiUpload, FiSun, FiMoon } from "react-icons/fi";
import {
  BsHeart, BsHeartFill, BsChatDots, BsShare,
  BsPlayFill, BsPauseFill, BsPencilSquare
} from "react-icons/bs";
import WaveformPlayer from "../components/WaveformPlayer";
import WaveformMiniPlayer from "../components/WaveformMiniPlayer";
import toast, { Toaster } from "react-hot-toast";

interface Song {
  id: number;
  title: string;
  style: string;
  vocal_style: string;
  duration: string;
  tags: string;
  audio_url: string;
  liked?: boolean;
  public?: boolean;
  thumbnail?: string;
}

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [vocalStyle, setVocalStyle] = useState("Pop");
  const [title, setTitle] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "liked" | "recent">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vocs_songs");
    if (saved) setSongs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("vocs_songs", JSON.stringify(songs));
  }, [songs]);

  const handleGenerateSong = () => {
    if (!title.trim()) return;

    setIsLoading(true);
    toast.loading("Generating your song...");

    setTimeout(() => {
      toast.dismiss();

      const dummySong: Song = {
        id: Date.now(),
        title,
        style,
        vocal_style: vocalStyle,
        duration: "2:30",
        tags: style,
        audio_url: "/audio/sample.wav",
        liked: false,
        public: false,
        thumbnail: `https://picsum.photos/seed/${Date.now()}/60/60`,
      };

      setSongs([dummySong, ...songs]);
      setTitle("");
      setLyrics("");
      setStyle("");
      setCurrentSong(dummySong);
      setIsPlaying(true);
      toast.success("🎵 Song created!");

      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }

      setIsLoading(false);
    }, 2000);
  };

  const handleUploadAudio = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) toast.success(`Uploaded: ${file.name}`);
    };
    input.click();
  };

  const toggleLike = (id: number) => {
    setSongs(songs.map((song) => (song.id === id ? { ...song, liked: !song.liked } : song)));
  };

  const togglePublic = (id: number) => {
    setSongs(songs.map((song) => (song.id === id ? { ...song, public: !song.public } : song)));
  };

  const renameSong = (id: number) => {
    const newTitle = prompt("Rename song:");
    if (newTitle) {
      setSongs(songs.map((song) => (song.id === id ? { ...song, title: newTitle } : song)));
    }
  };

  const filteredSongs = songs
    .filter((song) => song?.title.toLowerCase().includes(search.toLowerCase()))
    .filter((song) => activeTab === "liked" ? song.liked : true);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const selectSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(song);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col h-screen bg-[#0e0b1e] text-white transition-all duration-500 dark:bg-[#0e0b1e]">
        <Toaster position="top-right" />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 p-4 flex flex-col justify-between border-r border-zinc-800 bg-[#0e0b1e]">
            <div>
              <div className="mb-10 flex justify-center">
                <img src="/images/vocs-logo.png" alt="VOCS AI Logo" className="h-20 object-contain" />
              </div>
              <nav className="space-y-4">
                <button className="flex items-center gap-2 hover:text-purple-400"><FiHome /> Home</button>
                <button className="flex items-center gap-2 hover:text-purple-400"><FiPlus /> Create</button>
                <button className="flex items-center gap-2 hover:text-purple-400"><FiSearch /> Explore</button>
                <button className="flex items-center gap-2 hover:text-purple-400"><FiBell /> Notifications</button>
              </nav>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>50 Credits</span>
              <button onClick={() => setDarkMode(!darkMode)} className="hover:text-purple-400 transition">
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Create Section */}
            <div className="w-1/2 p-6 bg-[#1a132f] border-r border-zinc-800 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create a Song</h2>

              <textarea
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 mb-4"
                rows={4}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Write your lyrics here..."
              />
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Genre (e.g. pop, chill)"
              />
              <select
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                value={vocalStyle}
                onChange={(e) => setVocalStyle(e.target.value)}
              >
                <option>Pop</option>
                <option>Robotic</option>
                <option>Anime</option>
                <option>Male</option>
                <option>Female</option>
                <option>Whisper</option>
              </select>
              <input
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title"
              />

              <button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded text-white font-bold hover:scale-105 transition"
                onClick={handleGenerateSong}
                disabled={isLoading}
              >
                {isLoading ? "⏳ Generating..." : "🎤 Generate Song"}
              </button>

              <button
                onClick={handleUploadAudio}
                className="mt-4 flex items-center gap-2 bg-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-700"
              >
                <FiUpload /> Upload Audio
              </button>
            </div>

            {/* Workspace */}
            <div className="w-1/2 p-6 bg-[#0e0b1e] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">My Workspace</h2>

              <div className="flex gap-4 mb-4">
                {["all", "liked", "recent"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      activeTab === tab ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {tab === "all" && "All Songs"}
                    {tab === "liked" && "❤️ Liked"}
                    {tab === "recent" && "🕒 Recent"}
                  </button>
                ))}
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700"
                placeholder="Search..."
              />

              {isLoading ? (
                <div className="animate-pulse bg-gray-800 h-32 rounded-lg p-4" />
              ) : (
                <div className="space-y-4">
                  {filteredSongs.map((song) => {
                    const isCurrent = currentSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        className="p-4 bg-gray-900 border border-gray-700 rounded-xl flex gap-4 items-start hover:scale-[1.01] transition"
                        onClick={() => selectSong(song)}
                      >
                        <img src={song.thumbnail} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">{song.title}</h3>
                            <BsPencilSquare
                              className="cursor-pointer hover:text-purple-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                renameSong(song.id);
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-400">{song.tags}</p>
                          <p className="text-xs text-gray-500 mt-1">Duration: {song.duration}</p>
                          <div className="mt-2">
                            <WaveformMiniPlayer url={song.audio_url} height={30} />
                          </div>
                          <div className="mt-2 flex gap-2 flex-wrap items-center">
                            <button className="bg-gray-800 px-2 py-1 rounded">Extend</button>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={song.public}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  togglePublic(song.id);
                                }}
                              />
                              Public
                            </label>
                            <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}>
                              {song.liked ? <BsHeartFill className="text-purple-500" /> : <BsHeart />}
                            </button>
                            <BsChatDots />
                            <BsShare />
                            <button
                              className="ml-auto text-white text-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent && isPlaying) {
                                  audioRef.current?.pause();
                                  setIsPlaying(false);
                                } else {
                                  selectSong(song);
                                }
                              }}
                            >
                              {isCurrent && isPlaying ? <BsPauseFill /> : <BsPlayFill />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {currentSong && (
          <div className="bg-black text-white px-6 py-4 border-t border-gray-800 fixed bottom-0 left-0 w-full z-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{currentSong.title}</p>
                <p className="text-xs text-gray-400">{currentSong.duration}</p>
              </div>
              <button onClick={handlePlayPause} className="text-2xl">
                {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
              </button>
            </div>
            <WaveformPlayer
              audioUrl={currentSong.audio_url}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
