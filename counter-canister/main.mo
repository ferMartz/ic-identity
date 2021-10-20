import Principal "mo:base/Principal";

actor {
    stable var currentValue: Nat = 0;

    public func increment(): async () {
        currentValue += 1;
    };

    public query func getValue(): async Nat {
        currentValue;
    };
    public shared query(msg) func displayIdentity() : async  Text {
    let callerId = msg.caller;
    let pText = Principal.toText(callerId);
    return "Hello there " # pText # " , greetings!!!";
    };
};
