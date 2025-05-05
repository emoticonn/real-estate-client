import { useNavigate } from "react-router-dom";
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.propertyID}`);
  };

  const statusText = property.status === "for_sale"
    ? `Продається по вул. ${property.address}`
    : property.status === "for_rent"
    ? `Орендується по вул. ${property.address}`
    : property.address;

  const tagsArray = property.tags ? property.tags.split(",").map(tag => tag.trim()) : [];

  // Форматуємо дату красиво (день + місяць)
  const formatDate = (dateString) => {
    if (!dateString) return "Дата невідома";
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  // Формуємо текст для ЖК і Району
  const complexInfo = [
    property.residentialComplex,
    property.district,
    property.city
  ].filter(Boolean).join(" · ");

  return (
    <div className="property-card" onClick={handleClick}>

      <div className="property-image-slider">
        <img
         src={property.photoPath ? `https://localhost:7252/${property.photoPath}` : "/default-image.jpg"}
          alt="Фото нерухомості"
          className="property-image"
        />
      </div>

      <div className="property-info">

        <div className="property-top">
          <div className="property-price">{property.price.toLocaleString()} грн</div>
          <h2 className="property-address">{statusText}</h2>
        </div>

        {/* ЖК і район, якщо є */}
        {complexInfo && (
          <div className="property-complex">
            {complexInfo}
          </div>
        )}

        <div className="property-specs">
          <span>{property.rooms} кімнати</span>
          <span>{property.area} м²</span>
          <span>{property.floor} поверх з {property.totalFloors}</span>
        </div>

        <div className="property-tags">
          {tagsArray.length > 0 ? (
            tagsArray.map((tag, index) => <span key={index}>{tag}</span>)
          ) : (
            <span>Теги відсутні</span>
          )}
        </div>

        <div className="property-description">
          {property.description
            ? property.description.length > 200
              ? `${property.description.slice(0, 200)}...`
              : property.description
            : "Опис відсутній"}
        </div>

        <div className="property-date">
          Опубліковано {formatDate(property.publishDate)}
        </div>

      </div>

    </div>
  );
};

export default PropertyCard;
