import './DashboardCard.css';

export default function DashboardCard({text, value, subtitles}) {
    return (
        <>
            <div className="dashboard-card">
                <div className="dashboard-text">{text}</div>
                <div className="dashboard-value">{value}</div>
                <div className="dashboard-subtitle">{subtitles}</div>
            </div>
        </>
    );
}