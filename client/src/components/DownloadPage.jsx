import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const DownloadPage = () => {
  const { shortCode } = useParams();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/files/f/${shortCode}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("File not found");

        const data = await res.json();

        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("🔒 This file is password protected.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
    };

    fetchFile();

    return () => controller.abort();
  }, [shortCode]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.downloadUrl || file.path;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyFile = async () => {
    if (!password) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/files/verifyFilePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shortCode, password }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("✅ Password verified!");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (isLoading || !file) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="w-full max-w-screen-lg mx-auto bg-[var(--bg-color)] rounded shadow-md p-4 sm:p-6 flex flex-col gap-6 lg:flex-row">
      
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <p className="text-[var(--text-color)]">
          <strong>File Name:</strong> {file.name}
        </p>

        <div>
          <h2 className="text-lg font-semibold text-[var(--primary-text)] mb-2">
            File Preview
          </h2>

          {isProtected && !isVerified ? (
            <div className="border p-6 text-center rounded bg-gray-100 dark:bg-gray-800">
              🔒 Protected file. Enter password to view.
            </div>
          ) : (
            <>
              {file.type?.startsWith("image/") && (
                <img src={file.path} className="rounded" />
              )}

              {file.type?.startsWith("video/") && (
                <video controls className="rounded">
                  <source src={file.path} />
                </video>
              )}

              {file.type?.startsWith("audio/") && (
                <audio controls>
                  <source src={file.path} />
                </audio>
              )}

              {file.type === "application/pdf" && (
                <iframe src={file.path} className="w-full h-[400px]" />
              )}
            </>
          )}
        </div>

        <p className="text-[var(--text-color)]">
          <strong>Uploaded by:</strong> {file.uploadedBy}
        </p>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3">
        <p><strong>Date:</strong> {new Date(file.createdAt).toLocaleDateString()}</p>
        <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p><strong>Type:</strong> {file.type}</p>

        {isProtected && !isVerified && (
          <>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded"
            />
            <button onClick={verifyFile} className="bg-blue-600 text-white p-2 rounded">
              Verify
            </button>
          </>
        )}

        {(!isProtected || isVerified) && (
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white p-2 rounded"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;