import React, { useState } from 'react';

function AddProducts() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl mb-4">Add Curtain with Camera Capture</h2>
      <form>
        <div className="mb-4">
          <label>Capture Photo:</label>
          <input
            type="file"
            accept="image/*"
            capture="environment" // 'environment' for rear camera, 'user' for front camera
            onChange={handleImageCapture}
            className="border p-2 w-full"
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <img src={previewUrl} alt="Captured" className="max-w-xs" />
          </div>
        )}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
          Add Curtain
        </button>
      </form>
    </div>
  );
}

export default AddProducts;
