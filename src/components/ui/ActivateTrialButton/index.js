import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';

import { Button } from '@meetfranz/forms';

import UserStore from '../../../stores/UserStore';

const messages = defineMessages({
  action: {
    id: 'feature.delayApp.upgrade.action',
    defaultMessage: '!!!Get a Franz Supporter License',
  },
  actionTrial: {
    id: 'feature.delayApp.trial.action',
    defaultMessage: '!!!Yes, I want the free 14 day trial of Franz Professional',
  },
  shortAction: {
    id: 'feature.delayApp.upgrade.actionShort',
    defaultMessage: '!!!Upgrade account',
  },
  shortActionTrial: {
    id: 'feature.delayApp.trial.actionShort',
    defaultMessage: '!!!Activate the free Franz Professional trial',
  },
  noStringsAttachedHeadline: {
    id: 'pricing.trial.terms.headline',
    defaultMessage: '!!!No strings attached',
  },
  noCreditCard: {
    id: 'pricing.trial.terms.noCreditCard',
    defaultMessage: '!!!No credit card required',
  },
  automaticTrialEnd: {
    id: 'pricing.trial.terms.automaticTrialEnd',
    defaultMessage: '!!!Your free trial ends automatically after 14 days',
  },
});

@inject('stores', 'actions') @observer
class ActivateTrialButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    short: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    short: false,
  }

  static contextTypes = {
    intl: intlShape,
  };

  handleCTAClick() {
    const { actions, stores } = this.props;
    const { hadSubscription } = stores.user.data;
    // const { defaultTrialPlan } = stores.features.features;

    let label = '';
    if (!hadSubscription) {
      // actions.user.activateTrial({ planId: defaultTrialPlan });

      label = 'Start Trial';
    } else {
      label = 'Upgrade Account';
    }

    actions.ui.openSettings({ path: 'user' });
  }

  render() {
    const { stores, className, short } = this.props;
    const { intl } = this.context;

    const { hadSubscription } = stores.user.data;

    let label;
    if (hadSubscription) {
      label = short ? messages.shortAction : messages.action;
    } else {
      label = short ? messages.shortActionTrial : messages.actionTrial;
    }

    return (
      <Button
        label={intl.formatMessage(label)}
        className={classnames({
          [className]: className,
        })}
        buttonType="inverted"
        onClick={this.handleCTAClick.bind(this)}
        busy={stores.user.activateTrialRequest.isExecuting}
      />
    );
  }
}

export default ActivateTrialButton;

ActivateTrialButton.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
