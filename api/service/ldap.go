package service

import (
	"fmt"
	"log"

	"gopkg.in/ldap.v2"
)

// Ldap represents the service responsible for managing the connection with ldap.
type Ldap struct {
	readonlyUser     string
	readonlyPassword string
	binddn           string
	conn             *ldap.Conn
}

// NewLdap creates a new ldap service for authenticating.
func NewLdap(url, port, binddn, readonlyUser, readonlyPassword string) *Ldap {
	conn, err := ldap.Dial("tcp", fmt.Sprintf("%s:%s", url, port))
	if err != nil {
		log.Fatal(err)
	}
	return &Ldap{
		readonlyUser:     readonlyUser,
		readonlyPassword: readonlyPassword,
		binddn:           binddn,
		conn:             conn,
	}
}

// BindReadOnlyAccount connect the api to the LDAP with the read only account.
func (l *Ldap) BindReadOnlyAccount() error {
	err := l.conn.Bind(l.readonlyUser, l.readonlyPassword)
	if err != nil {
		return err
	}
	return nil
}

// CheckCredentials check if the credentials are good.
func (l *Ldap) CheckCredentials(username, password string) error {
	// Search for the given username
	searchRequest := ldap.NewSearchRequest(
		l.binddn,
		ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false,
		fmt.Sprintf("(&(uid=%s))", username),
		[]string{"dn"},
		nil,
	)

	sr, err := l.conn.Search(searchRequest)
	if err != nil {
		return err
	}

	if len(sr.Entries) != 1 {
		return fmt.Errorf("user does not exist or too many entries found")
	}

	userdn := sr.Entries[0].DN

	// Bind as the user to verify their password
	err = l.conn.Bind(userdn, password)
	if err != nil {
		return fmt.Errorf("wrong password")
	}
	l.BindReadOnlyAccount()
	return nil
}
