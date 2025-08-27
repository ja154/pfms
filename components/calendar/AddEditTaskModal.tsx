
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { CalendarTask } from '../../types';
import Modal from '../ui/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: CalendarTask | null;
  selectedDate?: string; // YYYY-MM-DD
}

const AddEditTaskModal: React.FC<ModalProps> = ({ isOpen, onClose, taskToEdit, selectedDate }) => {
  const { dispatch } = useData();
  const isEditMode = !!taskToEdit;
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const inputStyles = "w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-green-500 transition-shadow";


  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
          setTitle(taskToEdit.title);
          setDate(taskToEdit.date);
          setDescription(taskToEdit.description || '');
        } else {
          setTitle('');
          setDate(selectedDate || new Date().toISOString().split('T')[0]);
          setDescription('');
        }
    }
  }, [taskToEdit, isEditMode, isOpen, selectedDate]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (isEditMode) {
      dispatch({ 
          type: 'UPDATE_TASK', 
          payload: { ...taskToEdit, title, date, description } 
      });
    } else {
      const newTask: CalendarTask = {
        id: `t_${new Date().getTime()}`,
        title,
        date,
        description,
        completed: false
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Task' : 'Add New Task'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputStyles} />
            </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          <button type="submit" className="px-5 py-2.5 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 hover:shadow-glow-green transition-all duration-300">Save Task</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTaskModal;