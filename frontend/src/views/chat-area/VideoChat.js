function VideoChat({ modal_ref, hideModal, local, remote, pc }) {
    return (
        <div className="modal fade" ref={modal_ref} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                <button type="button" className="btn-close" onClick={hideModal}></button>
              </div>
            <div className="modal-body position-relative">
              <video ref={remote} className="w-100 h-75" style={{height: "400px"}} autoPlay playsInline ></video>
              <video ref={local} className="position-absolute bottom-0 end-0 "  style={{ width: "300px", height: "300px"}} autoPlay playsInline ></video>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary rounded-circle" style={{ width: '2.5rem', height: '2.5rem' }}><i className="bi bi-camera-video-fill"></i></button>
                <button type="button" className="btn btn-primary rounded-circle" style={{ width: '2.5rem', height: '2.5rem' }}><i className="bi bi-mic-fill"></i></button>
                <button type="button" className="btn btn-danger rounded-circle" style={{ width: '2.5rem', height: '2.5rem' }}><i className="bi bi-telephone-x-fill"></i></button>
              </div>
            </div>
          </div>
        </div>
    )
}

export default VideoChat