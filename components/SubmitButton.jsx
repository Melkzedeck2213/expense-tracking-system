//compnents/SubmitButton

export default function SubmitButton({ isSubmitting,text }) {
  return (
    <button className="btn btn-primary rounded-full" type="submit" disabled={isSubmitting}>

      {isSubmitting?<span className="loading loading-spinner"></span>:text}
    
    </button>
  );
}


  


