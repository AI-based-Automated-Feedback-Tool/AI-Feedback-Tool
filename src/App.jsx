import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>🚀 AI-Based Automated Feedback Tool</h1>
        <p className="subtitle">
          Empowering students and teachers with intelligent, personalized coding feedback.
        </p>
      </header>

      <main className="main-content">
        <section className="info-section">
          <h2>👩‍💻 For Students</h2>
          <ul>
            <li>✔️ Weekly coding assignments and exams</li>
            <li>✔️ Real-time AI feedback</li>
            <li>✔️ Encouragement and solution suggestions</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>🧑‍🏫 For Instructors</h2>
          <ul>
            <li>📊 Performance dashboards</li>
            <li>🛠️ Task configuration with AI assistance</li>
            <li>📁 Exportable student reports</li>
          </ul>
        </section>

        <p className="status-note">✅ Initial setup complete. Project ready to build.</p>
      </main>

      <footer className="footer">
        <p>Project 39 • React + Vite • Summer 2025</p>
      </footer>
    </div>
  )
}

export default App
