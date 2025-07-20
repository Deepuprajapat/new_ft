import React from "react";

const ConnectExpertSection = ({
  formData,
  handleChange,
  otpSent,
  otpVerified,
  error,
  sendOtp,
  handleOtpChange,
  otp,
  resendOtp,
  timer,
  verifyOtp,
  setOtpSent,
  showPopup,
  handleDownloadBrochure,
  closePopup,
  BrochurePopupDialog,
  projectData,
}) => (
  <div
    className="position-sticky"
    style={{
      top: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    <div className="bg-white rounded-3 mb-4 p-4 pb-0">
      <h4 className="mb-4 text-center">Connect to Our Expert</h4>

      {/* Form for sending OTP */}
      {!otpSent && !otpVerified && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <input
              name="username"
              className="form-control"
              type="text"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              name="useremail"
              className="form-control"
              type="email"
              placeholder="Email"
              value={formData.useremail}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <select
              name="userType"
              className="form-select"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Associate">Associate</option>
              <option value="Builder">Builder</option>
              <option value="Broker">Broker</option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <select
                name="dial_code"
                className="form-select"
                style={{ maxWidth: "100px" }}
                onChange={handleChange}
              >
                <option value="91">+91</option>
                <option value="61">+61</option>
                <option value="852">+852</option>
                <option value="968">+968</option>
                <option value="974">+974</option>
                <option value="65">+65</option>
                <option value="971">+971</option>
                <option value="44">+44</option>
                <option value="1">+1</option>
                <option value="27">+27</option>
                <option value="60">+60</option>
                <option value="64">+64</option>
                <option value="66">+66</option>
                <option value="966">+966</option>
                <option value="31">+31</option>
                <option value="973">+973</option>
                <option value="54">+54</option>
                <option value="43">+43</option>
                <option value="880">+880</option>
                <option value="32">+32</option>
                <option value="55">+55</option>
                <option value="86">+86</option>
                <option value="385">+385</option>
                <option value="42">+42</option>
                <option value="45">+45</option>
                <option value="1809">+1809</option>
                <option value="20">+20</option>
                <option value="358">+358</option>
                <option value="679">+679</option>
                <option value="33">+33</option>
                <option value="49">+49</option>
                <option value="30">+30</option>
                <option value="592">+592</option>
                <option value="36">+36</option>
                <option value="62">+62</option>
                <option value="353">+353</option>
                <option value="972">+972</option>
                <option value="39">+39</option>
                <option value="81">+81</option>
                <option value="962">+962</option>
                <option value="82">+82</option>
                <option value="965">+965</option>
                <option value="853">+853</option>
                <option value="52">+52</option>
                <option value="212">+212</option>
                <option value="47">+47</option>
                <option value="48">+48</option>
                <option value="351">+351</option>
                <option value="40">+40</option>
                <option value="7">+7</option>
                <option value="34">+34</option>
                <option value="46">+46</option>
                <option value="41">+41</option>
                <option value="1868">+1868</option>
                <option value="216">+216</option>
                <option value="90">+90</option>
                <option value="84">+84</option>
              </select>
              <input
                name="usermobile"
                className="form-control"
                type="tel"
                maxLength="10"
                placeholder="Phone"
                value={formData.usermobile}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">
              I am interested in
            </label>
            <select
              className="form-select"
              name="intersted_in"
              value={formData.intersted_in}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {projectData?.configurations
                ?.slice()
                .sort((a, b) => {
                  const numA = parseFloat(a) || 0;
                  const numB = parseFloat(b) || 0;
                  return numA - numB;
                })
                .map((config, index) => (
                  <option key={index} value={config}>
                    {config}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <textarea
              name="usermsg"
              className="form-control"
              placeholder="Message"
              rows="3"
              value={formData.usermsg}
              onChange={handleChange}
              style={{ resize: "none", overflowY: "auto" }}
            ></textarea>
          </div>
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          <div className="text-center d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#2067d1" }}
              onClick={sendOtp}
            >
              Get a Call back
            </button>
          </div>
        </form>
      )}

      {/* Form for OTP verification */}
      {otpSent && !otpVerified && (
        <div>
          <div className="alert alert-success">
            <span className="fw-bold">
              OTP sent to your {formData.usermobile}{" "}
              <a
                href="#"
                onClick={() => setOtpSent(false)}
                className="text-decoration-none"
              >
                Edit
              </a>
            </span>
          </div>
          <div className="mb-3">
            <input
              name="enterotp"
              className="form-control"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
            />
          </div>
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-primary"
              onClick={resendOtp}
              disabled={timer > 0}
            >
              Resend {timer > 0 && `(${timer}s)`}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!otp || otp.trim() === "") {
                  // setError("Please enter OTP");
                  return;
                }
                verifyOtp();
              }}
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* After OTP is verified */}
      {otpVerified && (
        <form onSubmit={sendOtp}>
          <div className="alert alert-success">
            OTP verified! We will connect with you shortly.
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      )}
    </div>
    <div
      className=" rounded-3 p-3 pt-3 text-center d-flex justify-content-center"
      style={{
        backgroundColor: "#2067d1",
        backgroundSize: "160px",
      }}
    >
      <button
        className="btn bg-white w-100"
        style={{ fontSize: "16px", color: "#2067d1" }}
        onClick={handleDownloadBrochure}
      >
        <i className="fas fa-download me-2"></i>
        DOWNLOAD BROCHURE
      </button>

      {/* Dialog Popup Trigger */}
      <BrochurePopupDialog
        open={showPopup}
        onClose={closePopup}
        projectName={projectData?.project_name || "Invest Mango"}
        brochure={projectData?.brochure}
      />
    </div>
  </div>
);

export default ConnectExpertSection;