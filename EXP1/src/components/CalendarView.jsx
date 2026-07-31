import React, { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectPostsByDate } from '../store/selectors/postsSelectors';

const CalendarView = React.memo(() => {
  const calendarData = useSelector(selectPostsByDate);
  const [selectedDate, setSelectedDate] = useState(null);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth()
    };
  }, []);

  const calendarGrid = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const grid = [];
    let week = [];
    
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      week.push({
        day,
        date: dateStr,
        posts: calendarData.postsByDate[dateStr] || [],
        isToday: date.toDateString() === new Date().toDateString()
      });
      
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }
    
    while (week.length < 7 && week.length > 0) {
      week.push(null);
    }
    if (week.length > 0) {
      grid.push(week);
    }
    
    return grid;
  }, [currentMonth, calendarData]);

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date === selectedDate ? null : date);
  }, [selectedDate]);

  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>📅 Calendar View</h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0' }}>{monthName}</h4>
        <div style={{ fontSize: '14px', color: '#777' }}>
          {calendarData.totalPosts} posts this month
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#555'
            }}>
              {day}
            </div>
          ))}
        </div>

        {calendarGrid.map((week, weekIndex) => (
          <div key={weekIndex} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: weekIndex < calendarGrid.length - 1 ? '1px solid #f0f0f0' : 'none'
          }}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                onClick={() => day && handleDateClick(day.date)}
                style={{
                  padding: '8px',
                  minHeight: '80px',
                  backgroundColor: day?.isToday ? '#e3f2fd' : 'white',
                  cursor: day ? 'pointer' : 'default',
                  borderRight: dayIndex < 6 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: day.posts.length > 0 ? 'bold' : 'normal',
                      color: day.posts.length > 0 ? '#1976d2' : '#333',
                      marginBottom: '4px'
                    }}>
                      {day.day}
                      {day.posts.length > 0 && (
                        <span style={{
                          marginLeft: '4px',
                          fontSize: '11px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          padding: '1px 6px',
                          borderRadius: '10px'
                        }}>
                          {day.posts.length}
                        </span>
                      )}
                    </div>
                    
                    {day.posts.length > 0 && selectedDate === day.date && (
                      <div style={{
                        fontSize: '11px',
                        color: '#555',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {day.posts.slice(0, 2).map((post, i) => (
                          <div key={i} style={{
                            backgroundColor: '#f0f7ff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginBottom: '2px',
                            fontSize: '10px'
                          }}>
                            {post.title.substring(0, 20)}...
                          </div>
                        ))}
                        {day.posts.length > 2 && (
                          <div style={{ color: '#999', fontSize: '10px' }}>
                            +{day.posts.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '10px',
          border: '1px solid #bbdefb'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>
            📅 Posts on {selectedDate}
          </h4>
          {calendarData.postsByDate[selectedDate]?.length > 0 ? (
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {calendarData.postsByDate[selectedDate].map(post => (
                <li key={post.id} style={{ margin: '4px 0' }}>
                  <strong>{post.title}</strong> - {post.author} 
                  (❤️ {post.engagement?.total || 0})
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: '0', color: '#777' }}>No posts on this day</p>
          )}
        </div>
      )}
    </div>
  );
});

CalendarView.displayName = 'CalendarView';
export default CalendarView;