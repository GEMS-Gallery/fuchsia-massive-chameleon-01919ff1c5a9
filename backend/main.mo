import Array "mo:base/Array";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  private stable var taxPayerEntries : [(Nat, TaxPayer)] = [];

  // Create a HashMap to store TaxPayer records
  private var taxPayers = HashMap.HashMap<Nat, TaxPayer>(0, Nat.equal, Nat.hash);

  // Initialize the HashMap with stable data
  private func initHashMap() {
    for ((k, v) in taxPayerEntries.vals()) {
      taxPayers.put(k, v);
    };
  };

  // Call initHashMap when the canister is created
  initHashMap();

  // Mutable variable to keep track of the next available TID
  private stable var nextTID : Nat = 1;

  // Create a new TaxPayer record
  public func createTaxPayer(firstName : Text, lastName : Text, address : Text) : async Result.Result<Nat, Text> {
    let newTaxPayer : TaxPayer = {
      tid = nextTID;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(nextTID, newTaxPayer);
    nextTID += 1;
    #ok(newTaxPayer.tid)
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Get a TaxPayer by TID
  public query func getTaxPayerByTID(tid : Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Update a TaxPayer record
  public func updateTaxPayer(tid : Nat, firstName : Text, lastName : Text, address : Text) : async Result.Result<(), Text> {
    switch (taxPayers.get(tid)) {
      case (null) {
        #err("TaxPayer not found")
      };
      case (?existingTaxPayer) {
        let updatedTaxPayer : TaxPayer = {
          tid = existingTaxPayer.tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayers.put(tid, updatedTaxPayer);
        #ok()
      };
    }
  };

  // Delete a TaxPayer record
  public func deleteTaxPayer(tid : Nat) : async Result.Result<(), Text> {
    switch (taxPayers.remove(tid)) {
      case (null) {
        #err("TaxPayer not found")
      };
      case (?_) {
        #ok()
      };
    }
  };

  // Pre-upgrade hook to save the state
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  // Post-upgrade hook to restore the state
  system func postupgrade() {
    initHashMap();
  };
}
