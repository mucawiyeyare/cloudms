import SurveyForm from '../SurveyForm';

export default function QuestionnaireView() {
  return (
    <div style={{ 
      backgroundColor: 'var(--color-bg)', 
      borderRadius: 'var(--radius-md)', 
      overflow: 'hidden', 
      border: '1px solid var(--color-border)' 
    }}>
      {/* We reuse the SurveyForm component inside the dashboard. 
          It has its own dark gradients that will naturally display perfectly here. */}
      <SurveyForm />
    </div>
  );
}
