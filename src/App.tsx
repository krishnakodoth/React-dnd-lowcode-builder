// 📁 src/App.tsx
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const ItemTypes = {
  COMPONENT: "component",
};

// Component types
interface ComponentProps {
  label: string;
  placeholder?: string;
  color?: string;
}

interface DroppedComponent {
  id: number;
  type: keyof typeof componentMap;
  props: ComponentProps;
}

interface SidebarComponentProps {
  type: keyof typeof componentMap;
  label: string;
}

const SidebarComponent = ({ type, label }: SidebarComponentProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    //@ts-ignore
    <div ref={drag} className="sidebar-item">
      {label}
    </div>
  );
};

interface CanvasProps {
  droppedComponents: DroppedComponent[];
  setDroppedComponents: React.Dispatch<React.SetStateAction<DroppedComponent[]>>;
}

const Canvas = ({ droppedComponents, setDroppedComponents }: CanvasProps) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: { type: keyof typeof componentMap }) => {
      const newItem: DroppedComponent = {
        id: Date.now(),
        type: item.type,
        props: defaultProps[item.type],
      };
      setDroppedComponents((prev) => [...prev, newItem]);
    },
  }));

  const renderComponent = (component: DroppedComponent) => {
    const { type, props, id } = component;
    const Component = componentMap[type];
    return <Component key={id} {...props} />;
  };

  return (
    //@ts-ignore
    <div ref={drop} className="canvas">
      {droppedComponents.map(renderComponent)}
    </div>
  );
};

// 🔧 Components to use in the builder
const TextInput = ({ label, placeholder }: ComponentProps) => (
  <div>
    <label>{label}</label>
    <input placeholder={placeholder} />
  </div>
);

const Checkbox = ({ label }: ComponentProps) => (
  <div>
    <label>
      <input type="checkbox" /> {label}
    </label>
  </div>
);

const Button = ({ label }: ComponentProps) => <button>{label}</button>;

const componentMap = {
  TextInput,
  Checkbox,
  Button,
};

const defaultProps: Record<keyof typeof componentMap, ComponentProps> = {
  TextInput: { label: "Name", placeholder: "Enter name" },
  Checkbox: { label: "I agree" },
  Button: { label: "Submit" },
};

function App() {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="sidebar">
          <h3>Components</h3>
          <SidebarComponent type="TextInput" label="Text Input" />
          <SidebarComponent type="Checkbox" label="Checkbox" />
          <SidebarComponent type="Button" label="Button" />
        </div>

        <Canvas
          droppedComponents={droppedComponents}
          setDroppedComponents={setDroppedComponents}
        />
      </div>
    </DndProvider>
  );
}

export default App;