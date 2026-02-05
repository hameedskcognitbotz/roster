import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store';
import { useToast } from './Toast';
import { Modal } from './Modal';

export function AddShiftModal() {
    const { isAddShiftModalOpen, setAddShiftModalOpen, users, addShift, shiftModalData } = useStore();
    const { addToast } = useToast();

    // Form state
    const [selectedUser, setSelectedUser] = useState('');
    const [shiftDate, setShiftDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    useEffect(() => {
        if (isAddShiftModalOpen) {
            if (shiftModalData?.userId) setSelectedUser(shiftModalData.userId);
            if (shiftModalData?.date) setShiftDate(shiftModalData.date);
        }
    }, [isAddShiftModalOpen, shiftModalData]);

    const handleAddShift = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            addToast('Please select a team member', 'error');
            return;
        }

        const newShift = {
            id: Math.random().toString(36).substring(2, 9),
            userId: selectedUser,
            startTime: `${shiftDate}T${startTime}:00`,
            endTime: `${shiftDate}T${endTime}:00`,
        };

        addShift(newShift);
        addToast('Shift added successfully!', 'success');
        setAddShiftModalOpen(false);
        // Reset form
        setSelectedUser('');
    };

    return (
        <Modal
            isOpen={isAddShiftModalOpen}
            onClose={() => setAddShiftModalOpen(false)}
            title="Create New Shift"
        >
            <form onSubmit={handleAddShift} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Team Member</label>
                    <select
                        className="input w-full"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Select a member...</option>
                        {users.filter(u => u.role === 'Employee').map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                        type="date"
                        className="input w-full"
                        value={shiftDate}
                        onChange={(e) => setShiftDate(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            className="input w-full"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                        <input
                            type="time"
                            className="input w-full"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={() => setAddShiftModalOpen(false)}
                        className="btn btn-outline flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-accent flex-1"
                    >
                        Create Shift
                    </button>
                </div>
            </form>
        </Modal>
    );
}
