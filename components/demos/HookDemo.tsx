"use client";

let index = 0;
const setters: ((value: any) => void)[] = [];
const state: any[] = [];

function useState<T>(initValue: T) {
  if (state[index] && setters[index]) {
    return [state[index], setters[index]];
  }

  let pair = [initValue, setState];

  function setState(nextState: T) {
    pair[0] = nextState;
    console.log(pair);
    index = 0;
  }

  state[index] = pair[0];
  setters[index] = pair[1] as (nextState: T) => void;
  index++;
  return pair;
}

const HookDemo = () => {
  const [value1, setValue1] = useState("value1");
  const [value2, setValue2] = useState("value2");
  const [value3, setValue3] = useState("value3");

  console.log({ setValue1 });

  return (
    <div className="ml-8 h-96 grow bg-ctp-crust">
      <button onClick={() => setValue3("VALUE1")}>VALUE1</button>
    </div>
  );
};

export default HookDemo;
