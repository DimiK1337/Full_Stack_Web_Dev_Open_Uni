interface AppProps {
  name: string;
}

const App = (props: AppProps) => {
  return (
    <div>
      Hello {props.name}
    </div>
  );
};

export default App;