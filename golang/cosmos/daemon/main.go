package daemon

import (
	"fmt"
	"os"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Agoric/agoric-sdk/golang/cosmos/daemon/cmd"
)

const (
	// Bech32MainPrefix defines the Bech32 prefix used by all types
	Bech32MainPrefix = "agoric"

	// CoinType is used in the slip44 HD key derivation path.
	// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
	CoinType = 564

	// Bech32PrefixAccAddr defines the Bech32 prefix of an account's address
	Bech32PrefixAccAddr = Bech32MainPrefix
	// Bech32PrefixAccPub defines the Bech32 prefix of an account's public key
	Bech32PrefixAccPub = Bech32MainPrefix + sdk.PrefixPublic
	// Bech32PrefixValAddr defines the Bech32 prefix of a validator's operator address
	Bech32PrefixValAddr = Bech32MainPrefix + sdk.PrefixValidator + sdk.PrefixOperator
	// Bech32PrefixValPub defines the Bech32 prefix of a validator's operator public key
	Bech32PrefixValPub = Bech32MainPrefix + sdk.PrefixValidator + sdk.PrefixOperator + sdk.PrefixPublic
	// Bech32PrefixConsAddr defines the Bech32 prefix of a consensus node address
	Bech32PrefixConsAddr = Bech32MainPrefix + sdk.PrefixValidator + sdk.PrefixConsensus
	// Bech32PrefixConsPub defines the Bech32 prefix of a consensus node public key
	Bech32PrefixConsPub = Bech32MainPrefix + sdk.PrefixValidator + sdk.PrefixConsensus + sdk.PrefixPublic
)

// DefaultController is a stub controller.
var DefaultController = func(needReply bool, str string) (string, error) {
	return "", fmt.Errorf("Controller not configured; did you mean to use `ag-chain-cosmos` instead?")
}

// SetConfigDefaults sets the appropriate parameters for the Agoric chain.
func SetConfigDefaults(config *sdk.Config) {
	config.SetCoinType(CoinType)
	config.SetBech32PrefixForAccount(Bech32PrefixAccAddr, Bech32PrefixAccPub)
	config.SetBech32PrefixForValidator(Bech32PrefixValAddr, Bech32PrefixValPub)
	config.SetBech32PrefixForConsensusNode(Bech32PrefixConsAddr, Bech32PrefixConsPub)
}

// Run starts the app with a stub controller.
func Run() {
	RunWithController(DefaultController)
}

// RunWithController starts the app with a custom upcall handler.
func RunWithController(sendToController cmd.Sender) {
	config := sdk.GetConfig()
	SetConfigDefaults(config)
	config.Seal()

	rootCmd, _ := cmd.NewRootCmd(sendToController)
	if err := cmd.Execute(rootCmd); err != nil {
		os.Exit(1)
	}
}
