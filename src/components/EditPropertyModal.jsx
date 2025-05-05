import { useState } from "react";
import "../styles/EditPropertyModal.css";

const EditPropertyModal = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    address: property.address || "",
    city: property.city || "",
    price: property.price || "",
    area: property.area || "",
    rooms: property.rooms || "",
    floor: property.floor || "",
    totalFloors: property.totalFloors || "",
    description: property.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedData = {
      propertyID: property.propertyID,
      address: formData.address,
      city: formData.city,
      status: property.status,
      price: parseFloat(formData.price),
      propertyDetails: {
        area: parseFloat(formData.area),
        rooms: parseInt(formData.rooms),
        floor: parseInt(formData.floor),
        totalFloors: parseInt(formData.totalFloors),
        description: formData.description,
        tags: property.tags || ""
      },
      propertyGallery: property.photoPath || property.galleryPaths ? {
        photoPath: property.photoPath || "",
        galleryPaths: property.galleryPaths || ""
      } : null,
      propertyLocation: property.district || property.residentialComplex ? {
        district: property.district || "",
        residentialComplex: property.residentialComplex || ""
      } : null
    };

    onSave(updatedData);
  };

  return (
    <div className="property-modal-overlay">
      <div className="property-modal">
        <h3>Редагування об'єкта</h3>

        <label>Адреса:</label>
        <input name="address" value={formData.address} onChange={handleChange} />

        <label>Місто:</label>
        <input name="city" value={formData.city} onChange={handleChange} />

        <label>Ціна (грн):</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} />

        <label>Площа (м²):</label>
        <input name="area" type="number" value={formData.area} onChange={handleChange} />

        <label>Кімнат:</label>
        <input name="rooms" type="number" value={formData.rooms} onChange={handleChange} />

        <label>Поверх:</label>
        <input name="floor" type="number" value={formData.floor} onChange={handleChange} />

        <label>Всього поверхів:</label>
        <input name="totalFloors" type="number" value={formData.totalFloors} onChange={handleChange} />

        <label>Опис:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <div className="property-modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>💾 Зберегти</button>
          <button className="cancel-btn" onClick={onClose}>Скасувати</button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
