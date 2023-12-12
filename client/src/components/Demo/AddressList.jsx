function AddressList({ addresses }) {
    const truncate = (str, n) => {
        return (str.length > n) ? str.slice(0, n) + ' ... ' + str.slice(str.length - n, str.length) : str;
    };

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            alert(' Address copied to clipboard!');
        }, function (err) {
            console.log('Async: Could not copy text: ', err);
        });
    }

    const copyText = (e) => {
        let el = e.target.children[0];
        copyTextToClipboard(el.innerText);
    }

    const listItems = addresses.map((number) =>
        <li
            style={{ pointerEvents: "cursor" }}
            onClick={copyText} value={number} key={number}> {truncate(number, 6)}
            <span hidden>{number}</span>

        </li>
    );
    return (
        <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", marginTop: "16px" }}>
            <div style={{ marginTop: "16px", marginBottom: "16px" }} > List of allowed (Click to Copy)
                <br />
                Total: {addresses.length}
            </div>
            <ul style={{ listStyleType: "none" }}>{listItems}</ul>
        </div>

    );
}

export default AddressList