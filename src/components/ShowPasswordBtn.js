export default function ShowPasswordBtn({ handleTogglePassword, showPassword }) {

    return (
        <button type="button" className="showPassword-btn" onClick={handleTogglePassword}>
            {showPassword ? <div>&#128580;</div> : <div>&#128526;</div>}
        </button>
    )
}