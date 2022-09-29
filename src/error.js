import { memo } from "react"

const Error = ({error, setError}) => {
    const reload = () => window.location.reload()
    return (
        <div className={`error ${error ? "error-show" : ""}`}>
            <div className="error-body">
                <div onClick={()=> setError(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </div>
                <div className="error-icon">
                    <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 32 32" xmlSpace="preserve">
                    <polyline className="st0" points="16.67,29 20,24 16.67,24 20,19 "/>
                    <path className="st0" d="M24,23.45c2.93-1.17,5-4.06,5-7.45c0-4.42-3.53-8-7.88-8c-3.75,0-6.88,2.66-7.67,6.22h-0.64
                        c-2.65,0-4.81,2.2-4.81,4.89S10.17,24,12.81,24"/>
                    <path className="st0" d="M16.44,9.58C15.69,6.94,13.24,5,10.34,5C9.79,5,9.27,5.07,8.77,5.2c1.43,0.48,2.47,1.81,2.47,3.39
                        c0,1.98-1.62,3.59-3.62,3.59c-1.6,0-2.93-1.03-3.42-2.45C4.08,10.23,4,10.75,4,11.29C4,13.82,5.51,16,7.68,17"/>
                    </svg>
                </div>
                <div className="error-text">
                    <h3>An error occured</h3>
                    <small>Please check your connection and try again, or try again later</small>
                </div>
                <div className="reload-button"><button onClick={reload}>Reload app</button></div>
            </div>
        </div>
    )
}


export default memo(Error)