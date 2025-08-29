
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
  const [reminder, setReminder] = useState('none');
  const inputStyles = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";


  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
          setTitle(taskToEdit.title);
          setDate(taskToEdit.date);
          setDescription(taskToEdit.description || '');
          setReminder(taskToEdit.reminder || 'none');
        } else {
          setTitle('');
          setDate(selectedDate || new Date().toISOString().split('T')[0]);
          setDescription('');
          setReminder('none');
        }
    }
  }, [taskToEdit, isEditMode, isOpen, selectedDate]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (isEditMode) {
      dispatch({ 
          type: 'UPDATE_TASK', 
          payload: { ...taskToEdit, title, date, description, reminder } 
      });
    } else {
      const newTask: CalendarTask = {
        id: `t_${new Date().getTime()}`,
        title,
        date,
        description,
        completed: false,
        reminder
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
                <label className="block text-sm font-medium text-slate-600 mb-1">Task Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputStyles} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Reminder</label>
                <select value={reminder} onChange={e => setReminder(e.target.value)} className={inputStyles}>
                    <option value="none">No Reminder</option>
                    <option value="30m">30 minutes before</option>
                    <option value="1h">1 hour before</option>
                    <option value="1d">1 day before</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Reminders are checked against the start of the task day (midnight).</p>
            </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3 border-t border-slate-200 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-semibold">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white border-transparent rounded-lg hover:bg-green-700 text-sm font-semibold">Save Task</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTaskModal;