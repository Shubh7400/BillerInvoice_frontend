import React from 'react';

const MyMapComponent = () => {
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      <iframe
        title="Location"

        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3475.959879786035!2d75.87823662661047!3d22.671235012718146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdc2ad268517%3A0x2344d262c1da7f7b!2sCubexO%20Software%20Solutions!5e0!3m2!1sen!2sin!4v1730109261223!5m2!1sen!2sin" 
        width="530"
        height="215"
        style={{ border: 0 }}
        
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default MyMapComponent;
