import { useState } from 'react';
import { createRepair, getErrorMessage } from '../api';
import useToast from '../hooks/useToast';

export default function CreateRepair({ onCreated, onClose }) {
  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const resetForm = () => {
    setDeviceType('');
    setBrand('');
    setProblemDescription('');
    setEstimatedPrice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await createRepair({
        device_type: deviceType,
        brand,
        problem_description: problemDescription,
        estimated_price: estimatedPrice ? Number(estimatedPrice) : 0,
      });
      addToast('Repair created successfully', 'success');
      resetForm();
      onCreated(response.data?.repair || response.data);
    } catch (fetchError) {
      addToast(getErrorMessage(fetchError), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <div className="toolbar">
          <h2>New Repair Request</h2>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Device type
            <input
              value={deviceType}
              onChange={(event) => setDeviceType(event.target.value)}
              placeholder="Laptop, Phone, Tablet"
              required
            />
          </label>

          <label>
            Brand
            <input
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              placeholder="Apple, Samsung, Dell"
              required
            />
          </label>

          <label>
            Problem description
            <textarea
              value={problemDescription}
              onChange={(event) => setProblemDescription(event.target.value)}
              placeholder="Describe the issue in detail"
              rows="4"
              required
            />
          </label>

          <label>
            Estimated price
            <input
              value={estimatedPrice}
              onChange={(event) => setEstimatedPrice(event.target.value)}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </label>

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Repair'}
          </button>
        </form>
      </div>
    </div>
  );
}
