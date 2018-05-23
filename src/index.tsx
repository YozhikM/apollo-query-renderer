import * as React from 'react';
import { Query } from 'react-apollo';
import { DocumentNode } from 'graphql';

export interface Props {
  query: DocumentNode;
  component: React.ReactNode;
  variables?: { [key: string]: any } | null;
}

export interface State {
  variables: { [key: string]: any } | null;
}

export default class QueryRenderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      variables: props.variables || {},
    };
  }

  _refetch = (variables: { [key: string]: any }, refetch: Function) => {
    this.setState({ variables }, () => {
      refetch(variables);
    });
  };

  render() {
    const { query, component, ...rest } = this.props;
    const { variables } = this.state;

    return (
      <Query query={query} variables={variables}>
        {({ loading, error, data, refetch, networkStatus, client }) => {
          if (loading) {
            return <div>Loading...</div>;
          } else if (error) {
            return <div>{error.message}</div>;
          }

          const Component = component;
          return (
            <Component
              client={client}
              data={{ ...data, variables }}
              refetch={v => this._refetch(v, refetch)}
              {...rest}
            />
          );
        }}
      </Query>
    );
  }
}
