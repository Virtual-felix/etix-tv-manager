package controller

import (
	"github.com/pkg/errors"
	"strconv"
)

func paramToIntHelper(str string) (int, error) {
	value, err := strconv.Atoi(str)
	if err != nil {
		return -1, errors.Wrap(err, "Bad parameters numeric expected")
	}
	return value, nil
}

func paramToBoolHelper(str string) (bool, error) {
	value, err := strconv.ParseBool(str)
	if err != nil {
		return false, errors.Wrap(err, "Bad parameters bool expected")
	}
	return value, nil
}
