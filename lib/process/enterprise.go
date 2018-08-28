package process

import (
	"fmt"

	"github.com/gravitational/teleport"

	"github.com/gravitational/trace"
)

// enterpriseModules is a Teleport Enterprise plugin
//
// It's taken straight from the Enterprise repo because go dep does not
// work with git submodules.
type enterpriseModules struct{}

// EmptyRolesHandler is called when a new trusted cluster with empty roles
// is created, for enterprise it returns an error as roles are mandatory
func (p *enterpriseModules) EmptyRolesHandler() error {
	return trace.BadParameter("missing 'role_map' parameter")
}

// DefaultAllowedLogins returns allowed logins for a new admin role, for
// enterprise it includes "root" as well
func (p *enterpriseModules) DefaultAllowedLogins() []string {
	return []string{teleport.TraitInternalRoleVariable, teleport.Root}
}

// PrintVersion prints teleport version, for enterprise it includes
// "Enterprise" in the output
func (p *enterpriseModules) PrintVersion() {
	ver := fmt.Sprintf("Teleport Enterprise v%s", teleport.Version)
	if teleport.Gitref != "" {
		ver = fmt.Sprintf("%s git:%s", ver, teleport.Gitref)
	}
	fmt.Println(ver)
}

// RolesFromLogins returns roles for external user based on the logins
// extracted from the connector
//
// For Enterprise edition "logins" are used as role names
func (p *enterpriseModules) RolesFromLogins(logins []string) []string {
	return logins
}

// TraitsFromLogins returns traits for external user based on the logins
// extracted from the connector
//
// For Enterprise edition "logins" are used as role names so traits are empty
func (p *enterpriseModules) TraitsFromLogins(logins []string) map[string][]string {
	return nil
}
