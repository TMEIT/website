import styled from "@emotion/styled";

const StyledCentered = styled(Centered)({
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    "& > .inner": { gridColumnStart: 2 }
});

function Centered({className, children}) {
    return (
        <div className={className}>
            <div className="inner">
                {children}
            </div>
        </div>
    );
}

export default StyledCentered;
