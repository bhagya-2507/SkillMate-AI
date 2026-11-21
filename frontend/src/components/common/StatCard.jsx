import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#4F46E5', bgLight = '#EEF2FF', subtitle, trend }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>{title}</span>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: bgLight,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            shrink: 0
          }}
        >
          {Icon && <Icon size={22} color={color} />}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            {trend && <span style={{ color: trend.startsWith('+') ? '#10B981' : '#64748B', fontWeight: 600 }}>{trend} </span>}
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
