import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";


const ContactPage = () => {
  return (
    <div className=" bg-gray-300 h-[100vh] p-4">
    <div className="h-[100%] p-6 md:p-12 hidden md:flex flex-col items-center rounded-4xl bg-white ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-bold text-4xl mb-2">Contact Us</h1>
        <p className="text-gray-500 text-lg">Any question or remarks? Just write us a message!</p>
      </div>

      {/* Form */}
      <form className="w-full max-w-4xl space-y-6">
        {/* First Row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              className="w-full border-b-2 border-gray-300 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              className="w-full border-b-2 border-gray-300 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border-b-2 border-gray-300 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="w-full border-b-2 border-gray-300 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold mb-2">Select Subject?</label>
          <div className="flex flex-wrap gap-4">
            {["General Inquiry", "Billing Issue", "XYZ issue", "General Inquiry"].map((subject, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input type="radio" name="subject" defaultChecked={i === 0} />
                {subject}
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-1">Message</label>
          <textarea
            placeholder="Write your message.."
            rows={3}
            className="w-full border-b-2 border-gray-300 focus:outline-none py-2 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-black text-white py-3 px-8 rounded-full shadow-lg hover:bg-gray-900 transition"
          >
            Send Message
          </button>
        </div>
      </form>

      
     {/* Footer Info */}
<div className="mt-12 w-[100%] ">
  <div className="max-w-4xl mx-auto">
    {/* Heading */}
    <div className="flex justify-center mb-4">
      <h2 className="font-bold text-2xl  text-black px-4 py-2 rounded">
        Contact Information
      </h2>
    </div>

    {/* Contact Info (Centered) */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-gray-700 text-sm mb-4">
      <div className="flex items-center gap-2">
        <Phone className="text-black "/> <span>+1012 3456 789</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="text-black " /> <span>demo@gmail.com</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="text-black"/>
        <span>
          132 Dartmouth Street Boston, Massachusetts 02156 United States
        </span>
      </div>
    </div>

    {/* Social Icons  */}
    {/* <div className="flex justify-center gap-4 text-xl text-black">
      <Twitter />
      <Instagram />
      <Facebook />
    </div> */}
  </div>
</div>
</div>
</div>
  );
};

export default ContactPage;
