const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed In</h1>
  ) : (
    <h1>You are not signed In</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  return {};
};

export default LandingPage;
