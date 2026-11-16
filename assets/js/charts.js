// Charts Initialization for Hotel Management Dashboard & Analytics

function initializeAnalyticsCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Revenue Trend Chart (Line Chart)
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Revenue ($K)',
          data: [42, 55, 48, 67, 58, 72, 85, 94],
          borderColor: '#EF3F09',
          backgroundColor: 'rgba(239, 63, 9, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#EF3F09',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: function(value) { return '$' + value + 'K'; } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. User Activity / Daily Guests Chart (Bar Chart)
  const activityCtx = document.getElementById('activityChart');
  if (activityCtx) {
    new Chart(activityCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Occupied Rooms',
          data: [78, 82, 88, 95, 110, 118, 105],
          backgroundColor: '#82D9D7',
          borderColor: '#5BCCCA',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Traffic Sources / Booking Channels (Pie Chart)
  const trafficCtx = document.getElementById('trafficChart');
  if (trafficCtx) {
    new Chart(trafficCtx, {
      type: 'pie',
      data: {
        labels: ['Direct Booking', 'Booking.com', 'Agoda', 'Expedia', 'Travel Agent'],
        datasets: [{
          data: [40, 25, 18, 12, 5],
          backgroundColor: ['#EF3F09', '#82D9D7', '#FAAC7B', '#C5E151', '#A855F7'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15, font: { size: 12 } } }
        }
      }
    });
  }

  // 4. Device Types / Booking Method (Doughnut Chart)
  const deviceCtx = document.getElementById('deviceChart');
  if (deviceCtx) {
    new Chart(deviceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Mobile App', 'Website Desktop', 'Walk-in / Desk'],
        datasets: [{
          data: [50, 35, 15],
          backgroundColor: ['#C5E151', '#82D9D7', '#FAAC7B'],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15, font: { size: 12 } } }
        }
      }
    });
  }
}
