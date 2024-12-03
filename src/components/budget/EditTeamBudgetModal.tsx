import React, { useState } from 'react';
import { useBudgetStore } from '../../store/budgetStore';
import { FormField } from '../common/FormField';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { ConferenceManageModal } from './ConferenceManageModal';

interface EditTeamBudgetModalProps {
  teamId: string;
  onClose: () => void;
}

export const EditTeamBudgetModal: React.FC<EditTeamBudgetModalProps> = ({
  teamId,
  onClose
}) => {
  const store = useBudgetStore();
  const [selectedConferenceId, setSelectedConferenceId] = useState<string | null>(null);
  const team = store.teams.find(t => t.id === teamId);
  const budgetItems = team?.budget
    ? store.budgetItems.filter(item => item.budgetId === team.budget!.id)
    : [];

  const handleUpdateSpent = (itemId: string, spent: number) => {
    const item = budgetItems.find(i => i.id === itemId);
    if (!item) return;

    store.addBudgetItem({
      ...item,
      spent
    });
  };

  const handleDeleteItem = (itemId: string) => {
    store.deleteBudgetItem(itemId);
  };

  const handleManageConference = (itemId: string) => {
    setSelectedConferenceId(itemId);
  };

  if (!team || !team.budget) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Edit Budget for {team.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">×</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetItems.map(item => {
                const category = store.budgetCategories.find(c => c.id === item.budgetCategoryId);
                const remaining = item.amount - (item.spent || 0);
                const isOverBudget = remaining < 0;
                const isConference = category?.name === 'Conferences';

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span>{category?.name}</span>
                        {isConference && (
                          <button
                            onClick={() => handleManageConference(item.id)}
                            className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      <input
                        type="number"
                        value={item.spent || 0}
                        onChange={(e) => handleUpdateSpent(item.id, Number(e.target.value))}
                        className="w-20 sm:w-24 px-2 py-1 text-right border rounded"
                      />
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${
                      isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${remaining.toLocaleString()}
                      {isOverBudget && (
                        <AlertTriangle className="inline-block ml-1 h-4 w-4 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedConferenceId && (
        <ConferenceManageModal
          budgetItemId={selectedConferenceId}
          onClose={() => setSelectedConferenceId(null)}
        />
      )}
    </div>
  );
};