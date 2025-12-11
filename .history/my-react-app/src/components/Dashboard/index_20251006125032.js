import React from 'react';

export function Dashboard() {
  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Baloo 2, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          color: '#1a202c',
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: 0,
          fontFamily: 'Baloo 2, sans-serif'
        }}>
          Dashboard
        </h1>
        <p style={{
          color: '#718096',
          fontSize: '1.1rem',
          margin: '0.5rem 0 0 0'
        }}>
          Welcome to your HR Management Dashboard
        </p>
      </div>

      {/* Dashboard Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Employees Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            color: '#2d3748',
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Total Employees
          </h3>
          <p style={{
            color: '#4a5568',
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            color: '#fc6544'
          }}>
            42
          </p>
        </div>

        {/* Active Projects Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            color: '#2d3748',
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Active Projects
          </h3>
          <p style={{
            color: '#4a5568',
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            color: '#06007c'
          }}>
            8
          </p>
        </div>

        {/* Pending Contracts Card */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            color: '#2d3748',
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Pending Contracts
          </h3>
          <p style={{
            color: '#4a5568',
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            color: '#a8a8a8ff'
          }}>
            3
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          color: '#2d3748',
          fontSize: '1.5rem',
          fontWeight: '600',
          margin: '0 0 1rem 0'
        }}>
          Recent Activity
        </h2>
        
        <div style={{ color: '#718096' }}>
          <div style={{
            padding: '0.75rem 0',
            borderBottom: '1px solid #e2e8f0'
          }}>
            📋 New employee John Doe added to the system
          </div>
          <div style={{
            padding: '0.75rem 0',
            borderBottom: '1px solid #e2e8f0'
          }}>
            ⏰ Time tracking updated for Project Alpha
          </div>
          <div style={{
            padding: '0.75rem 0',
            borderBottom: '1px solid #e2e8f0'
          }}>
            📄 Contract #2024-001 approved and signed
          </div>
          <div style={{
            padding: '0.75rem 0'
          }}>
            👥 Employee Sarah Johnson's profile updated
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <button style={{
          backgroundColor: '#fc6544',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          fontFamily: 'Baloo 2, sans-serif'
        }}>
          Add New Employee
        </button>
        <button style={{
          backgroundColor: '#06007c',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          fontFamily: 'Baloo 2, sans-serif'
        }}>
          Generate Report
        </button>
        <button style={{
          backgroundColor: '#a8a8a8ff',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          fontFamily: 'Baloo 2, sans-serif'
        }}>
          View Analytics
        </button>
      </div>
    </div>
  );
}