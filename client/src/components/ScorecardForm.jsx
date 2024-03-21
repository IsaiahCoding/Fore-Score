import React, { useState } from 'react';

const Scorecard = () => {
  const [formData, setFormData] = useState({
    date: '',
    courseName: '',
    totalCoursePar: '',
    holeStats: [], // Will be an array of objects containing hole stats
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHoleStatChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedHoleStats = [...formData.holeStats];
    if (type === 'checkbox') {
      updatedHoleStats[index][name] = checked;
    } else {
      updatedHoleStats[index][name] = value;
    }
    setFormData({ ...formData, holeStats: updatedHoleStats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/scorecard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle success (e.g., redirect to dashboard)
      } else {
        const errorData = await response.json();
        console.error('Scorecard creation failed:', errorData); // Handle error
      }
    } catch (error) {
      console.error('Scorecard creation failed:', error); // Handle network error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
      </label>
      <label>
        Course Name:
        <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} />
      </label>
      <label>
        Total Course Par:
        <input type="number" name="totalCoursePar" value={formData.totalCoursePar} onChange={handleChange} />
      </label>
      <hr />
      <h3>Hole Stats</h3>
      {[...Array(18)].map((_, index) => (
        <div key={index}>
          <h4>Hole {index + 1}</h4>
          <label>
            Par:
            <input type="number" name="par" value={formData.holeStats[index]?.par || ''} onChange={(e) => handleHoleStatChange(e, index)} />
          </label>
          <label>
            User Score:
            <input type="number" name="userScore" value={formData.holeStats[index]?.userScore || ''} onChange={(e) => handleHoleStatChange(e, index)} />
          </label>
          <label>
            Fairway Hit:
            <input type="checkbox" name="fairwayHit" checked={formData.holeStats[index]?.fairwayHit || false} onChange={(e) => handleHoleStatChange(e, index)} />
          </label>
          <label>
            Green in Regulation:
            <input type="checkbox" name="greenInReg" checked={formData.holeStats[index]?.greenInReg || false} onChange={(e) => handleHoleStatChange(e, index)} />
          </label>
          <label>
            Putts:
            <input type="number" name="putts" value={formData.holeStats[index]?.putts || ''} onChange={(e) => handleHoleStatChange(e, index)} />
          </label>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Scorecard;
