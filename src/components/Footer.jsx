import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-dark text-white py-3 py-md-4 mt-auto'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-md-6 text-center text-md-start mb-2 mb-md-0'>
            <p className='mb-0'>
              &copy; {new Date().getFullYear()} FinanceTracker
            </p>
          </div>
          <div className='col-12 col-md-6 text-center text-md-end'>
            <p className='small mb-0'>
              Made by {'    '}
              <a
                href='https://www.linkedin.com/in/sagar-kumar-choudhary-059741254/'
                className='text-white text-decoration-none fw-bold name-hover'
                target='_blank'
                rel='noopener noreferrer'
              >
                Sagar Choudhary
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
