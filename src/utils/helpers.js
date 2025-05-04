export const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  export const formatTime = (time) => {
    if (!time) return '';
    
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours}:${minutes} ${period}`;
  };
  
  export const getStatusColor = (status) => {
    const statusColors = {
      pending: '#F2C94C',
      confirmed: '#29D697',
      completed: '#5B8EF4',
      cancelled: '#FF4D4F'
    };
    
    return statusColors[status.toLowerCase()] || '#CCCCCC';
  };