import React, { useState } from "react";

function ImageUploader() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("image", selectedFile);

            try {
                const response = await fetch("https://insights-api-dev.cyc-bpo.com/sgc", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                if (response.ok) {
                    // Handle a successful response from the backend
                    console.log("Image uploaded successfully.");
                } else {
                    // Handle errors or failed requests
                    console.error("Image upload failed.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            alert("Please select an image to upload.");
        }
    };

    return (
        <div style={{ margin: "120px" }}>
            <input name="file" type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
}

export default ImageUploader;
