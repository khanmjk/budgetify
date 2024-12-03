import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBudgetStore } from '../store/budgetStore';
import { PageHeader } from '../components/common/PageHeader';
import { DollarSign, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'];

export const DepartmentDetails: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const store = useBudgetStore();
  const [expandedManagers, setExpandedManagers] = useState<Set<string>>(new Set());
  
  const department = store.departments.find(dept => dept.id === departmentId);
  const organization = department 
    ? store.organizations.find(org => org.id === department.organizationId)
    : null;
  const managers = store.getManagersByDepartment(departmentId || '');

  if (!departmentId || !department || !organization) {
    return <div>Department not found</div>;
  }

  const toggleManager = (managerId: string) => {
    const newExpanded = new Set(expandedManagers);
    if (newExpanded.has(managerId)) {
      newExpanded.delete(managerId);
    } else {
      newExpanded.add(managerId);
    }
    setExpandedManagers(newExpanded);
  };

  // Calculate budget statistics
  const getTeamBudgetTotal = (managerId: string) => {
    const teams = store.getTeamsByManager(managerId);
    return teams.reduce((total, team) => total + (team.budget?.totalAmount || 0), 0);
  };

  const departmentTotal = department.totalBudget || 0;
  const managerBudgets = managers.map(manager => ({
    name: manager.name,
    value: getTeamBudgetTotal(manager.id)
  }));

  const unallocatedBudget = departmentTotal - managerBudgets.reduce((sum, item) => sum + item.value, 0);
  if (unallocatedBudget > 0) {
    managerBudgets.push({
      name: 'Unallocated',
      value: unallocatedBudget
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title={department.name}
        backUrl={`/organization/${department.organizationId}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget Overview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Department Budget</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${departmentTotal.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allocated to Teams</p>
              <p className="text-2xl font-semibold text-indigo-600">
                ${(departmentTotal - unallocatedBudget).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unallocated Budget</p>
              <p className="text-2xl font-semibold text-green-600">
                ${unallocatedBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Distribution Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={managerBudgets}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {managerBudgets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Structure */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Department Structure</h2>
        <div className="space-y-4">
          {managers.map(manager => {
            const teams = store.getTeamsByManager(manager.id);
            const isExpanded = expandedManagers.has(manager.id);
            const managerTotal = getTeamBudgetTotal(manager.id);

            return (
              <div key={manager.id} className="border rounded-lg">
                <button
                  onClick={() => toggleManager(manager.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{manager.name}</h3>
                      <p className="text-sm text-gray-500">
                        {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${managerTotal.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((managerTotal / departmentTotal) * 100).toFixed(1)}% of budget
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t px-4 py-3 space-y-3">
                    {teams.map(team => (
                      <div key={team.id} className="flex items-center justify-between pl-7">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{team.name}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            ${(team.budget?.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};