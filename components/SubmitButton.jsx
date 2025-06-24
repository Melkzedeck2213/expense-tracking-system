export default function SubmitButton({ isSubmitting,text }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>

      {isSubmitting?<span className="loading loading-spinner"></span>:text}
    
    </button>
  );
}


  


