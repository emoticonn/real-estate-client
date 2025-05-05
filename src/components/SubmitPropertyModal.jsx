import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/SubmitPropertyModal.css";

const SubmitPropertyModal = ({ onClose, onSubmitted }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    area: "",
    rooms: "",
    price: "",
    status: "for_sale",
    floor: "",
    totalFloors: "",
    tags: [],
    description: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const tagOptions = ["Новобудова", "Біля метро", "З ремонтом", "Без ремонту", "Затишний район", "Паркова зона"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, tags: selectedTags }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const validateForm = () => {
    if (!formData.address || !formData.city || !formData.area || !formData.rooms || !formData.price) {
      alert("Будь ласка, заповніть всі обов'язкові поля.");
      return false;
    }
    if (formData.area <= 0 || formData.rooms <= 0 || formData.price <= 0) {
      alert("Площа, кімнати і ціна повинні бути більше нуля.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    let photoPaths = [];
  
    if (selectedFiles.length > 0) {
      try {
        const fileData = new FormData();
        selectedFiles.forEach(file => {
          fileData.append("files", file);
        });
        fileData.append("address", formData.address);
  
        const uploadResponse = await axios.post("https://localhost:7252/api/property/upload-multiple", fileData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        photoPaths = uploadResponse.data.filePaths;
      } catch (error) {
        console.error("Помилка при завантаженні фото:", error);
        alert("Не вдалося завантажити фото");
        return;
      }
    }
  
    const cleanedAddress = formData.address.toLowerCase().includes("вулиця")
      ? formData.address
      : `вулиця ${formData.address}`;
  
    const payload = {
      address: cleanedAddress,
      city: formData.city,
      status: formData.status,
      price: parseFloat(formData.price),
      propertyDetails: {
        area: parseFloat(formData.area),
        rooms: parseInt(formData.rooms),
        floor: parseInt(formData.floor || 0),
        totalFloors: parseInt(formData.totalFloors || 0),
        description: formData.description,
        tags: formData.tags.join(",")
      },
      propertyGallery: {
        photoPath: photoPaths.length > 0 ? photoPaths[0] : "",
        galleryPaths: photoPaths.join(",")
      },
      propertyLocation: {
        district: "", // Поки що пусто, можна потім додати поле в форму
        residentialComplex: "" // Теж можна потім додати
      }
    };
  
    try {
      await axios.post("https://localhost:7252/api/property", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Об'єкт успішно подано!");
      onSubmitted();
    } catch (error) {
      console.error("Помилка при подачі об'єкта:", error);
      alert("Помилка при подачі об'єкта.");
    }
  };

  return (
    <div className="submit-modal-overlay">
      <div className="submit-modal">
        <button className="submit-close-button" onClick={onClose}>×</button>
        <h2>Подати нову нерухомість</h2>
        <form onSubmit={handleSubmit} className="submit-form">
          <input type="text" name="address" placeholder="Адреса (наприклад, Пушкіна 5)" value={formData.address} onChange={handleChange} required />
          <input type="text" name="city" placeholder="Місто" value={formData.city} onChange={handleChange} required />
          <input type="number" name="area" placeholder="Площа (м²)" value={formData.area} onChange={handleChange} min="1" required />
          <input type="number" name="rooms" placeholder="Кількість кімнат" value={formData.rooms} onChange={handleChange} min="1" required />
          <input type="number" name="price" placeholder="Ціна (грн)" value={formData.price} onChange={handleChange} min="1" required />
          <input type="number" name="floor" placeholder="Поверх" value={formData.floor} onChange={handleChange} min="0" />
          <input type="number" name="totalFloors" placeholder="Всього поверхів" value={formData.totalFloors} onChange={handleChange} min="0" />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="for_sale">Продається</option>
            <option value="for_rent">В оренду</option>
          </select>

          <select multiple name="tags" value={formData.tags} onChange={handleTagsChange}>
            {tagOptions.map((tag, idx) => (
              <option key={idx} value={tag}>{tag}</option>
            ))}
          </select>

          <input type="file" accept="image/*" multiple onChange={handleFilesChange} />

          <div className="preview-container">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt="Попередній перегляд" />
            ))}
          </div>

          <textarea name="description" placeholder="Опис нерухомості" value={formData.description} onChange={handleChange} rows="4" />

          <button type="submit">Подати об'єкт</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPropertyModal;
