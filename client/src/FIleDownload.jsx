import { useEffect, useState } from "react";
import axiosInstance from "./config/axiosInstance";
import { useParams } from "react-router-dom";

const FileDownload = () => {
  const { code } = useParams();

  const [fileData, setFileData] = useState(null);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(`/files/resolveShareLink/${code}`);

        setFileData(res.data);

        if (res.data.isPasswordProtected) {
          setShowPasswordPrompt(true);
        }

      } catch (err) {
        setError(err?.response?.data?.error || "File not found");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [code]);

  const handlePasswordSubmit = async () => {
    try {
      await axiosInstance.post(`/files/verifyFilePassword`, {
        shortCode: code,
        password
      });

      setShowPasswordPrompt(false);
      setError("");

    } catch (err) {
      setError(err?.response?.data?.error || "Incorrect password");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.post(
        `/files/download/${fileData.fileId}`,
        { password }
      );

      window.open(res.data.downloadUrl, "_blank");

    } catch (err) {
      setError(err?.response?.data?.error || "Download failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading file details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-10 max-w-xl mx-auto border rounded-lg shadow bg-white">

      <h2 className="text-xl font-semibold mb-4">
        File Name: {fileData?.name}
      </h2>

      <p className="mb-2">
        File Size: {(fileData?.size / (1024 * 1024)).toFixed(2)} MB
      </p>

      <p className="mb-2">
        Uploaded on: {fileData?.createdAt
          ? new Date(fileData.createdAt).toLocaleString()
          : "-"}
      </p>

      <p className="mb-4">
        File Type: {fileData?.type}
      </p>

      {showPasswordPrompt ? (
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handlePasswordSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Verify
          </button>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Download
        </button>
      )}

    </div>
  );
};

export default FileDownload;