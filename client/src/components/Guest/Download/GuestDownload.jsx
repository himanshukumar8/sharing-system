import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GuestDownload = () => {
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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/files/g/${shortCode}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("File not found");

        const data = await res.json();
        setFile(data);
        setIsProtected(data.isPasswordProtected);
        setIsLoading(false);

        if (data.isPasswordProtected) {
          toast.info("🔒 This file is password protected. Please enter the password.");
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
    link.href = file.downloadUrl;
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/verifyGuestFilePassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shortCode, password }),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success("✅ Password verified! You can now download the file.");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (isLoading || !file) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="w-full max-w-screen-lg mx-auto bg-[var(--bg-color)] rounded shadow-md p-4 sm:p-6 flex flex-col gap-6 lg:flex-row">
      
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <p className="text-[var(--text-color)]">
          <strong>File Name:</strong> {file.name}
        </p>

        {isProtected && !isVerified ? (
          <div className="text-center p-6 border-dashed border">
            🔒 Protected File
          </div>
        ) : (
          <>
            {file.type.startsWith("image/") && <img src={file.path} />}
            {file.type.startsWith("video/") && (
              <video controls>
                <source src={file.path} type={file.type} />
              </video>
            )}
            {file.type === "application/pdf" && (
              <iframe src={file.path} className="w-full h-[400px]" />
            )}
          </>
        )}
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3">
        <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>

        {isProtected && !isVerified && (
          <>
            <input
              type="password"
              placeholder="Enter Password"
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
          <button onClick={handleDownload} className="bg-green-600 text-white p-2 rounded">
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestDownload;