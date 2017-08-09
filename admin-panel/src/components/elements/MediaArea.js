import React, { Component } from 'react';
import createAbosluteGrid from 'react-absolute-grid';
import MediaTile from './MediaTile';
import MediaFolder from './MediaFolder';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import InputTextDialog from './InputTextDialog';
import './MediaArea.css';

// Components

const AbsoluteGridFile = createAbosluteGrid(MediaTile, {}, true);
const AbsoluteGridFolder = createAbosluteGrid(MediaFolder);

const SortFilesButton = props => {
  return (
    <RaisedButton
      label={props.label}
      primary={true}
      className={'sortButton'}
      onTouchTap={props.onTouchTap}
    />
  );
};

// API Requests

const GetAllFiles = () => {
  return window.httpClient.get('/media/list/');
};

const DeleteFile = name => {
  const data = new FormData();
  data.append('name', name);

  return window.httpClient.put('/media', data);
};

const RenameFile = (name, newName) => {
  const data = new FormData();
  data.append('name', name);
  data.append('newname', newName);

  return window.httpClient.put('/media/rename', data);
};

// Helper

const uniqueArray = a => [...new Set(a)];

const SortFiles = (fileList, pathArray) => {
  var folders = [];
  var files = [];
  var path = pathArray.join('/');

  path = path.length > 0 ? (path += '/') : path;
  fileList.map(file => {
    var match = file.name.indexOf(path) === 0;
    if (!match) {
      return file;
    }
    var fullFileName = file.name.substr(path.length, file.name.length);
    var fullFileNameArray = fullFileName.split('/');
    if (fullFileNameArray.length > 1) {
      folders.push(fullFileNameArray[0]);
      return file;
    }
    files.push(file);
    return file;
  });
  folders = uniqueArray(folders);
  return { medias: files, folders: folders };
};

// Main

export default class MediaArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allFiles: [],
      mediaList: [],
      folderList: [],
      path: [],
      actualFolder: '',
      sort: 'sort',
      createFolderDialog: false,
      createFolderDialogError: '',
    };
  }

  componentDidMount() {
    this.refreshMediaList();
  }

  sumPath = newPath => {
    var obj = SortFiles(this.state.allFiles, [...this.state.path, newPath]);
    this.setState(state => {
      return {
        path: [...state.path, newPath],
        actualFolder: newPath,
        mediaList: obj.medias,
        folderList: obj.folders,
      };
    });
  };

  subPath = () => {
    var newPath = [...this.state.path];
    var folder = newPath.pop();
    var obj = SortFiles(this.state.allFiles, newPath);
    this.setState(state => {
      return {
        path: newPath,
        actualFolder: folder,
        mediaList: obj.medias,
        folderList: obj.folders,
      };
    });
  };

  refreshMediaList = () => {
    GetAllFiles()
      .then(response => {
        var obj = SortFiles(response.data, this.state.path);
        this.setState({ allFiles: response.data, mediaList: obj.medias, folderList: obj.folders });
      })
      .catch(error => {
        console.log('Error while getting all files: ', error);
      });
  };

  searchFilter = value => {
    var search = new RegExp(value, 'i');
    const list = this.state.mediaList.map(function(item) {
      const isMatched = !item.name.match(search);
      if (!item.filtered || isMatched !== item.filtered) {
        return {
          ...item,
          filtered: isMatched,
        };
      }
      return item;
    });
    this.setState(state => {
      return { mediaList: list };
    });
  };

  sortByName = () => this.setState({ sort: 'name' });
  sortBySize = () => this.setState({ sort: 'size' });
  sortByDate = () => this.setState({ sort: 'lastmodified' });

  // Folder add dialog

  createFolder = name => {
    if (new Set(this.state.folderList).has(name)) {
      this.setState({
        createFolderDialogError: "You can't use duplicate folder names, use another one.",
      });
      return;
    }
    this.setState(state => {
      return {
        folderList: [...state.folderList, name],
        createFolderDialog: false,
        createFolderDialogError: '',
      };
    });
  };

  createFolderDialogOpen = () => {
    this.setState(state => {
      return { createFolderDialog: true };
    });
  };

  // Folder tile callback

  enterFolder = item => {
    this.sumPath(item.name);
  };

  // Media tile callback

  removeFile = name => {
    DeleteFile(name)
      .then(response => {
        this.refreshMediaList();
      })
      .catch(error => {
        console.log('Error while removing file: ', error);
      });
  };

  renameFile = (name, newName) => {
    RenameFile(name, newName)
      .then(response => {
        this.refreshMediaList();
      })
      .catch(error => {
        console.log('Error while renaming file: ', error);
      });
  };

  moveToFolder = (fileName, folderName) => {
    var newName = folderName + '/' + fileName;
    if (folderName === '..') {
      var itemPathArray = fileName.split('/');
      var itemName = itemPathArray.pop();
      itemPathArray.pop();
      itemPathArray.push(itemName);
      newName = itemPathArray.join('/');
    }
    this.renameFile(fileName, newName);
  };

  render() {
    const list = this.state.mediaList.map(item => {
      item.onRemove = this.removeFile;
      item.onMenuSelection = this.moveToFolder;
      item.menuItems = this.state.folderList;
      item.onTextChange = this.renameFile;
      item.isRoot = this.state.path.length === 0;
      return item;
    });

    const folderList = this.state.folderList.map(item => {
      var obj = {};
      obj.name = item;
      obj.onDoubleClick = this.enterFolder;
      return obj;
    });

    return (
      <div style={sContainer}>
        <div>
          <FloatingActionButton mini={true} onTouchTap={this.subPath}>
            <FontIcon className="material-icons">arrow_back</FontIcon>
          </FloatingActionButton>
          <FloatingActionButton mini={true} onTouchTap={this.createFolderDialogOpen}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
          <InputTextDialog
            title={'Add folder'}
            actionName={'Add'}
            open={this.state.createFolderDialog}
            onAction={this.createFolder}
            error={this.state.createFolderDialogError}
          />
          <SortFilesButton label="Names" onTouchTap={this.sortByName} />
          <SortFilesButton label="Sizes" onTouchTap={this.sortBySize} />
          <SortFilesButton label="Dates" onTouchTap={this.sortByDate} />
          <AutoComplete
            hintText="Type anything"
            dataSource={list}
            dataSourceConfig={{ text: 'name', value: 'name' }}
            onUpdateInput={this.searchFilter}
            floatingLabelText="Search a file"
            fullWidth={false}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <AbsoluteGridFolder
            items={folderList}
            keyProp={'name'}
            sortProp={'name'}
            responsive={true}
            dragEnabled={false}
            itemWidth={160}
            itemHeight={40}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <AbsoluteGridFile
            items={list}
            keyProp={'name'}
            sortProp={this.state.sort}
            responsive={true}
            dragEnabled={false}
            itemWidth={160}
            itemHeight={160}
          />
        </div>
      </div>
    );
  }
}

// Inline styles

const sContainer = {
  margin: 30,
};
