import React from "react";

const AboutPage = () => {
  const features = [
    {
      title: "AI-Driven Technology",
      description:
        "Utilizing cutting-edge AI to analyze job descriptions and craft personalized resumes that stand out to employers.",
    },
    {
      title: "User-Centric Design",
      description:
        "Our platform is designed for simplicity, making it easy for anyone to create a professional resume in minutes.",
    },
    {
      title: "Privacy First",
      description:
        "We respect your privacy. Your data and documents are securely protected and never shared.",
    },
    {
      title: "Continuous Innovation",
      description:
        "Our team is dedicated to continuously improving our service, incorporating user feedback and the latest in AI research.",
    },
  ];

  const testimonials = [
    {
      quote: "This app transformed my job search. Highly recommended!",
      author: "Alex Johnson, Software Developer",
    },
    // Add more testimonials here
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl leading-9 font-extrabold text-white sm:text-4xl sm:leading-10">
            About QwikResume
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            Revolutionizing your job application process with the power of AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Features Section */}
          <div className="space-y-10">
            {features.map((feature) => (
              <Feature
                key={feature.title}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          {/* Testimonials Section */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-white mb-6">
              Hear From Our Users
            </h3>
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg leading-6 font-medium text-white mb-8">
            Ready to elevate your resume?
          </p>
          <a
            href="/register"
            className="px-8 py-3 mt-2 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 md:py-4 md:text-lg md:px-10"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, description }) => (
  <div>
    <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-400">{description}</p>
  </div>
);

const Testimonial = ({ quote, author }) => (
  <blockquote className="mt-8">
    <p className="text-lg text-white font-semibold">"{quote}"</p>
    <footer className="mt-2 text-base text-gray-400">- {author}</footer>
  </blockquote>
);

export default AboutPage;
