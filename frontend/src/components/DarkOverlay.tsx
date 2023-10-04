function DarkerOverlay(props: {
  show: boolean;
}) {
  if (props.show) {
    return (
      <div className="h-full w-full bg-black bg-opacity-50 absolute bg-center flex justify-center" />
    );
  }
  return <div />;
}

export default DarkerOverlay;
